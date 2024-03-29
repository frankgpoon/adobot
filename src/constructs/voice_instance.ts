import { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus, AudioPlayer, AudioResource, VoiceConnection, PlayerSubscription, AudioPlayerIdleState, DiscordGatewayAdapterCreator } from '@discordjs/voice';
import { BaseGuildVoiceChannel } from 'discord.js';
import { DEFAULT_VOICE_ONLINE_TIME_MS } from '../const';
import { loggers } from 'winston';
import { ResourceMetadata } from "./resource_metadata";


const logger = loggers.get('global_logger');

export class VoiceInstance {
  voiceChannel: BaseGuildVoiceChannel | null;
  connection: VoiceConnection | null;

  audioPlayer: AudioPlayer | null;
  interruptPlayer: AudioPlayer | null;
  activeSubscription: PlayerSubscription | null | undefined;

  audioQueue: Array<AudioResource>;
  timer: ReturnType<typeof setTimeout> | null;

  constructor() {
    this.voiceChannel = null;
    this.connection = null;

    this.audioQueue = [];
    this.timer = null;

    // 1 unique connection and timer per voice instance
    this.interruptPlayer = null;
    this.audioPlayer = null;
    this.activeSubscription = null;
  }


  joinChannel(voiceChannel: BaseGuildVoiceChannel) {
    this.voiceChannel = voiceChannel;
    this.connection = joinVoiceChannel({
      channelId: this.voiceChannel.id,
      guildId: this.voiceChannel.guild.id,
      adapterCreator: this.voiceChannel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
    });

    this.connection.on('error', error => {
      logger.error(`Error: ${error.message} with connection in channel ${this.voiceChannel?.id}`);
    });

    this.audioPlayer = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });

    this.activeSubscription = this.connection.subscribe(this.audioPlayer);
    if (typeof this.activeSubscription === 'undefined') {
      logger.error(`Could not subscribe the VoiceConnection in ${this.voiceChannel.id} to an audio player!`);
      this.connection.destroy();
    }

    this.audioPlayer.on('error', error => {
      let metadata: ResourceMetadata = error.resource.metadata as ResourceMetadata;
      logger.error(`Error: ${error.message} when playing resource ${metadata.url}`);
      this.playNext();
    });

    this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
      logger.verbose(`AudioPlayer is idle. Attempting to play next song.`);
      let nextResourceMetadata = this.playNext();

      if (!nextResourceMetadata) {
        logger.info(`Setting new timer to leave channel in ${DEFAULT_VOICE_ONLINE_TIME_MS} ms`);

        this.removeTimer();
        this.timer = setTimeout(() => this.disconnect(), DEFAULT_VOICE_ONLINE_TIME_MS);
      }
      
    });

    this.audioPlayer.on(AudioPlayerStatus.Playing, () => {
      logger.verbose('Clearing timer as player is now playing')
      this.removeTimer();
    });
  }


  /**
   * Plays the next resource in the queue. (This is meant to be used for natural
   * play nexts, e.g. after a song ends)
   * @returns metadata of the next resource if it plays next, null if the queue is empty
   */
  private playNext(): ResourceMetadata | null {
    let metadata = this.skip();
    if (metadata) {
      metadata.commandChannel!.send(`Now playing "${metadata.title}" by ${metadata.authorName}`);
    }
    return metadata;
  }

  /**
   * Skips the current resource
   * The difference between this and playNext() is that skip() is meant to be 
   * @returns metadata of the next resource if it plays next, null if the queue is empty
   */
  skip(): ResourceMetadata | null {
    if (this.audioPlayer) {
      let next = this.audioQueue.shift();
      if (!next) {
        logger.verbose(`Queue is empty. Not playing anything.`);
        this.audioPlayer.stop();
        return null;
      } else {
        let metadata: ResourceMetadata = next.metadata as ResourceMetadata;
        logger.verbose(`Now playing ${metadata.url}`);
        this.audioPlayer.play(next);
        return metadata;
      }
    } else {
      throw 'Adobot must be in a channel before running this';
    }
  }


  /**
   * Plays a resource immediately, or adds it to a queue.
   * @param resource the resource to play or add to the queue
   * @returns the position in the queue (0 if it plays immediately)
   */
  playOrQueue(resource: AudioResource): number {
    if (this.audioPlayer) { 
      if (this.audioPlayer.state.status == AudioPlayerStatus.Idle) {
        this.play(resource);
        return 0;
      } else {
        return this.addToQueue(resource);
      }
    } else {
      throw 'Adobot must be in a channel before running this';
    }
  }


  /**
   * Plays a resource immediately
   * @param resource the resource to play
   */
  private play(resource: AudioResource) {
    // invariant: joinChannel must be called
    let metadata: ResourceMetadata = resource.metadata as ResourceMetadata;
    if (this.audioPlayer!) {
      logger.verbose(`Now playing ${metadata.url}`);
      this.audioPlayer.play(resource);
    } else {
      throw 'Adobot must be in a channel before running this';
    }
  }


  /**
   * Adds a resource to the queue
   * @param resource the resource to add
   * @returns the position in the queue
   */
  private addToQueue(resource: AudioResource) {
    if (this.audioPlayer) {
      this.audioQueue.push(resource);
      return this.audioQueue.length;
    } else {
      throw 'Adobot must be in a channel before running this';
    }
  }


  /**
   * Pauses the audio player. If the interrupt player is active this will fail.
   * @return true if the audio player was successfully paused
   */
  pause() {
    // cannot pause an interrupt
    if (this.audioPlayer) {
      if (this.activeSubscription?.player === this.audioPlayer) {
        return this.audioPlayer.pause();
      } else {
        throw 'Something important is playing. Please wait and try again.';
      }
    } else {
      throw 'Adobot must be in a channel before running this';
    }
  }


  /**
   * Unpauses the audio player. If the interrupt player is active this will fail.
   * @return true if the audio player was successfully unpaused
   */
  unpause() {
    // cannot pause an interrupt
    if (this.audioPlayer) {
      if (this.activeSubscription?.player === this.audioPlayer) {
        return this.audioPlayer.unpause();        
      } else {
        throw 'Something important is playing. Please wait and try again.';
      } 
    } else {
      throw 'Adobot must be in a channel before running this';
    }
  }


  /**
   * Stops the player and purges everything from the queue. This works even during
   * an interrupt.
   */
  stop() {
    if (this.audioPlayer) {
      this.audioPlayer.stop();
      this.audioQueue = [];
    } else {
      throw 'Adobot must be in a channel before running this';
    }
  }


  private disconnect() {
    this.removeTimer();

    this.activeSubscription?.unsubscribe();
    this.activeSubscription = null;
    
    this.stop();
    this.audioPlayer = null;

    this.interruptPlayer?.stop();
    this.interruptPlayer = null;

    this.connection?.destroy();
    this.connection = null;

    this.voiceChannel = null;
  }


  private removeTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = null;
  }


  interrupt(resource: AudioResource, durationInMilliseconds?: number) {
    if (this.audioPlayer) {
      this.interruptPlayer = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause,
        },
      });

      this.activeSubscription?.unsubscribe();
      this.activeSubscription = this.connection?.subscribe(this.interruptPlayer);

      this.interruptPlayer.on(AudioPlayerStatus.Idle, () => {
        this.activeSubscription?.unsubscribe();
        this.activeSubscription = this.connection?.subscribe(this.audioPlayer!);
        
        this.interruptPlayer?.stop();
        this.interruptPlayer = null;
      })

      this.interruptPlayer.play(resource);
      if (durationInMilliseconds) {
        setTimeout(() => {
          this.interruptPlayer!.state = {
            status: AudioPlayerStatus.Idle
          };
        }, 
        durationInMilliseconds)
      }
    } else {
      throw 'Adobot must be in a channel before running this';
    }
    
  }

}
