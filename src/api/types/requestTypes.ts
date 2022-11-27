export interface Request {
  api:string
  data?:object
  loading?:boolean
}

export interface XRequestData{
  data:object|number|string|boolean|null,
  meta:{
    error:null|string,
    token?:{
      access:string
      refresh:string
    }
  }
}

export interface XRequestError{
  status:number
  statusText:string
}

export type XRequestResponse=XRequestData|XRequestError

export interface ErrorHandler{
  result:{
     status?:number
     meta?:{[key:string]:string}
   }
  param:string
  state:string
}
