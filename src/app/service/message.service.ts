import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Set<string> = new Set();

  add(message: string) {
    this.messages.add(message);
  }

  clear() {
    this.messages = new Set();
  }
}
