import { TransmitChannelName } from '../common/StrongFB-types';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
// import { log } from './public';

@Injectable({
  providedIn: 'root'
})
export class StrongFBTransmitService<N extends string = TransmitChannelName> {

  protected channels: { name: N, channel: BehaviorSubject<any> }[] = [];


  constructor() { }

  emit<T = any>(name: N, data: T) {
    // =>search for exist channel by name
    const channel = this.channels.find(i => i.name === name);
    if (channel) {
      channel.channel.next(data);
    }
    // =>if not found, create new channel
    else {
      this.add<T>(name, data);
    }
  }

  listen<T = any>(name: N): BehaviorSubject<T> {
    // =>try to find channel by name
    const channel = this.channels.find(i => i.name === name);
    if (channel) {
      return channel.channel;
    }
    // =>if not found channel, create it and set undefined value to it!
    else {
      return this.add<T>(name, undefined as any).channel;
    }
  }

  protected add<T>(name: N, initData: T) {
    // log('add new channel:', name);
    this.channels.push({
      name,
      channel: new BehaviorSubject<T>(initData),
    });
    return this.channels[this.channels.length - 1];
  }
}
