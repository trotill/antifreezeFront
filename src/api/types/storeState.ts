import { AntifreezeState } from 'src/api/types/antifreezeTypes'
import { FooterDogState } from 'src/api/types/footerDogTypes'
import { EventState } from 'src/api/types/eventState'

export interface StoreState{
  whoAmi: boolean|null,
  authorized: boolean,
  isMobile: boolean,
  windowWidth: number,
  newEventState: EventState[],
  footerDogState:FooterDogState,
  antifreezeState: AntifreezeState
}

export interface NewEventStateItem{
  ts:number,
  eventId: string,
  status: boolean, // false - continue, true - term
  deviceId: string,
  value: { [key:string]:number|string },
  prio: number
}

export type NewEventState=NewEventStateItem[]

export interface StoreActions {
  footerDogStateAct: (payload:FooterDogState) => void
  antifreezeStateAct: (payload:AntifreezeState) => void,
  newEventStateAct: (payload:NewEventState) => void
}
