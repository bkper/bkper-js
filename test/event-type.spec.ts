import { expect } from 'chai';
import { EventType } from '../src/model/Enums.js';

type ApiEventType = NonNullable<bkper.Event['type']>;
type EventTypeValue = `${EventType}`;

describe('EventType', () => {
    it('covers every event type exposed by the API', () => {
        // Fails compilation if the API exposes an event type missing from the enum.
        const covered: [Exclude<ApiEventType, EventTypeValue>] extends [never] ? true : false = true;
        expect(covered).to.equal(true);
    });

    it('only contains event types exposed by the API', () => {
        // Fails compilation if the enum has a value the API does not accept.
        const valid: [Exclude<EventTypeValue, ApiEventType>] extends [never] ? true : false = true;
        expect(valid).to.equal(true);
    });
});
