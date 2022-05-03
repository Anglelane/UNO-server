export const has = (container:Map<string,Object>,key:string)=>{
  return container.has(key)
}

export const get = (container:Map<string,Object>,key:string)=>{
  return container.get(key)
}

export const set = (container:Map<string,Object>,key:string,value:Object)=>{
  container.set(key,value)
}

export const deleteKey = (container:Map<string,Object>,key:string)=>{
  return container.delete(key)
}
