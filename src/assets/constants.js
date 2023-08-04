export const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwktPuqZ8FOnZpdNyG6mWxyr88YK3FAPMZlY1SiigqZGLV13Oj8IinMhCeqS3ymnr-hsQ/exec'
export const LS_Number = '_rafshi_patient_number'
export const LS_Details = '_rafshi_patient_details'

export function zipObj(k,v){
  let Obj = ({});
  for (let i=0; i < k.length; i++) Obj[k[i]] = v[i]
  return Obj;
}
