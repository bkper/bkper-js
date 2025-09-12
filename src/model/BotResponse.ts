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
     * Gets the type of this Bot Response.
     *
     * @returns The type of this Bot Response
     */
    public getType(): BotResponseType | undefined {
        return this.payload.type as BotResponseType | undefined;
    }

    /**
     * Gets the agent id of this Bot Response.
     *
     * @returns The agent id of this Bot Response
     */
    public getAgentId(): string | undefined {
        return this.payload.agentId;
    }

    /**
     * Gets the message of this Bot Response.
     *
     * @returns The message of this Bot Response
     */
    public getMessage(): string | undefined {
        return this.payload.message;
    }

    /**
     * Gets the date this Bot Response was created.
     *
     * @returns The date this Bot Response was created
     */
    public getCreatedAt(): Date | undefined {
        return this.payload.createdAt ? new Date(new Number(this.payload.createdAt).valueOf()) : undefined;
    }

    /**
     * Gets the Event this Bot Response is associated to.
     *
     * @returns The Event this Bot Response is associated to
     */
    public getEvent(): Event {
        return this.event;
    }

    /**
     * Replay this Bot Response.
     * 
     * @returns The updated Bot Response
     */
    public async replay(): Promise<BotResponse> {
        const eventId = this.event.getId();
        if (eventId == null) {
            throw new Error("Event id null!");
        }
        const agentId = this.getAgentId();
        if (agentId == null) {
            throw new Error("Agent id null!");
        }
        const updatedEventPayload = await EventService.replayBotResponse(this.event.getBook(), eventId, agentId, this.event.getBook().getConfig());
        this.updateCache(updatedEventPayload);
        return this;
    }

    /**
     * Delete this Bot Response.
     * 
     * @returns The deleted Bot Response
     */
    public async remove(): Promise<BotResponse> {
        const eventId = this.event.getId();
        if (eventId == null) {
            throw new Error("Event id null!");
        }
        const agentId = this.getAgentId();
        if (agentId == null) {
            throw new Error("Agent id null!");
        }
        const updatedEventPayload = await EventService.deleteBotResponse(this.event.getBook(), eventId, agentId, this.event.getBook().getConfig());
        this.updateCache(updatedEventPayload);
        return this;
    }

    /** @internal */
    private updateCache(updatedEventPayload: bkper.Event): void {
        // Update event
        this.event.payload = updatedEventPayload;
        this.event.clearCache();
        // Update bot response
        const updatedBotResponsePayload = updatedEventPayload?.botResponses?.find(r => r.agentId && r.agentId === this.getAgentId());
        this.payload = updatedBotResponsePayload || {};
    }

}
