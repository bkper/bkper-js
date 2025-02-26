import * as EventService from '../service/event-service.js';
import { Event } from './Event.js';
import { BotResponseType } from "./Enums.js";

/**
 * 
 * This class defines a Bot Response associated to an [[Event]].
 * 
 * @public
 */
export class BotResponse {

    public payload: bkper.BotResponse;

    /** @internal */
    private event: Event;

    constructor(event: Event, payload?: bkper.BotResponse) {
        this.event = event;
        this.payload = payload || {};
    }

    /**
     * @return The type of this Bot Response
     */
    public getType(): BotResponseType | undefined {
        return this.payload.type as BotResponseType | undefined;
    }

    /**
     * @return The agent id of this Bot Response
     */
    public getAgentId(): string | undefined {
        return this.payload.agentId;
    }

    /**
     * @return The message of this Bot Response
     */
    public getMessage(): string | undefined {
        return this.payload.message;
    }

    /**
     * @returns The date this Bot Response was created
     */
    public getCreatedAt(): Date | undefined {
        return this.payload.createdAt ? new Date(new Number(this.payload.createdAt).valueOf()) : undefined;
    }

    /**
     * Replay this Bot Response.
     * 
     * @returns The updated Bot Response
     */
    public async replay(): Promise<this> {
        const eventId = this.event.getId();
        if (eventId == null) {
            throw new Error("Event id null!");
        }
        const agentId = this.getAgentId();
        if (agentId == null) {
            throw new Error("Agent id null!");
        }
        const updatedEventPayload = await EventService.replayBotResponse(this.event.getBook(), eventId, agentId);
        this.event.payload = updatedEventPayload;
        this.findAndUpdateBotResponsePayload(updatedEventPayload);
        return this;
    }

    /**
     * Delete this Bot Response.
     * 
     * @returns The deleted Bot Response
     */
    public async remove(): Promise<this> {
        const eventId = this.event.getId();
        if (eventId == null) {
            throw new Error("Event id null!");
        }
        const agentId = this.getAgentId();
        if (agentId == null) {
            throw new Error("Agent id null!");
        }
        const updatedEventPayload = await EventService.deleteBotResponse(this.event.getBook(), eventId, agentId);
        this.event.payload = updatedEventPayload;
        this.findAndUpdateBotResponsePayload(updatedEventPayload);
        return this;
    }

    /** @internal */
    private findAndUpdateBotResponsePayload(event: bkper.Event): void {
        if (event && event.botResponses) {
            const updatedPayload = event.botResponses.find(r => r.agentId && r.agentId === this.getAgentId());
            if (updatedPayload) {
                this.payload = updatedPayload;
            }
        }
    }

}
