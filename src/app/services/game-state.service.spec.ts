import { TestBed } from '@angular/core/testing';

import { GameStateService } from './game-state.service';
import { IMqttServiceOptions, MqttModule, MqttService } from 'ngx-mqtt';
import { environment } from '../../environments/environment';

describe('GameStateService', () => {
  let service: GameStateService;
  const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
    hostname: environment.mqttHost,
    port: environment.mqttPort,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MqttModule.forRoot(MQTT_SERVICE_OPTIONS)],
      providers: [MqttService]
    });
    service = TestBed.get(GameStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should receive game start message', (done) => {
    service.gameStart().subscribe(message => {
      done();
    });

    service.mockGameStartFromMqtt().subscribe(() => {});
  });

  it('should receive correct winners when game is over', (done) => {
    service.gameOver().subscribe(winner => {
      expect(winner).toEqual({winners: [0]});
      done();
    });

    service.mockGameOverFromMqtt({winners: [0]}).subscribe(() => {});
  });

  it('should publish game reset', (done) => {
    service.resetGame().subscribe(() => done());
  });
});
