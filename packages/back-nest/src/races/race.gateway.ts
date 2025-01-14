import { UseFilters } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { socketCors } from 'src/config/cors';
import { RaceExceptions } from './race.exceptions';
import { RaceEvents } from './services/race-events.service';
import { RaceManager } from './services/race-manager.service';
import { SessionState } from './services/session-state.service';

@WebSocketGateway(socketCors)
export class RaceGateway {
  @WebSocketServer()
  server: Server;
  logger = console;

  constructor(
    private raceManager: RaceManager,
    private sessionState: SessionState,
    private raceEvents: RaceEvents,
  ) {}

  afterInit() {
    this.logger.info('[SpeedTyper.dev] Websocket Server Started.');
  }

  handleDisconnect(socket: Socket) {
    this.logger.info(
      `Client disconnected: ${socket.request.session.user.username}`,
    );
    this.sessionState.removeRaceID(socket);
  }

  handleConnection(socket: Socket) {
    this.logger.info(
      `Client connected: ${socket.request.session.user.username}`,
    );
  }

  @UseFilters(new RaceExceptions())
  @SubscribeMessage('refresh_challenge')
  async onRefreshChallenge(socket: Socket) {
    const raceId = this.sessionState.getRaceID(socket);
    if (!raceId) return;
    const user = this.sessionState.getUser(socket);
    if (this.raceManager.isOwner(user.id, raceId)) {
      const challenge = await this.raceManager.refresh(raceId);
      socket.to(raceId).emit('challenge_selected', challenge);
      socket.emit('challenge_selected', challenge);
    }
  }

  @SubscribeMessage('play')
  async onPlay(socket: Socket) {
    const user = this.sessionState.getUser(socket);
    const race = await this.raceManager.create(user);
    this.raceEvents.createdRace(socket, race);
    this.sessionState.saveRaceID(socket, race.id);
  }

  @SubscribeMessage('join')
  async onJoin(socket: Socket, id: string) {
    const user = this.sessionState.getUser(socket);
    const race = this.raceManager.join(user, id);
    if (!race) {
      // if there is no race with the ID in the state
      // we recreate a race for the user
      // this makes sure that the game does not crash for the user
      // TODO: we should create a race with the same ID, and even same challenge selected
      // So that the other people in the race can then join the same room
      // instead of creating their own throught this same functionality
      // we do however have to reset the progress for all participants as it is only kept in state
      return this.onPlay(socket);
    }
    this.raceEvents.joinedRace(socket, race, user);
    this.sessionState.saveRaceID(socket, id);
  }
}
