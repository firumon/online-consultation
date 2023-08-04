import {ROCRef} from "boot/firebase";
import { getDoc,updateDoc,arrayUnion,arrayRemove,serverTimestamp,deleteField } from 'firebase/firestore'

export function DO_BOOK({ No }){
  return updateDoc(ROCRef,{ Awaiting:arrayUnion(parseInt(No)),[`times._${No}_`]:serverTimestamp() })
}

export function PATIENT_ONLINE(No){
  return updateDoc(ROCRef,{ [`times._${No}_`]:serverTimestamp() })
}

export function DOCTOR_STATUS(n_status){
  getDoc(ROCRef).then(docSnap => {
    let { status,Consulting } = docSnap.data();
    if(n_status !== status) {
      return (Consulting > 0) ? updateDoc(ROCRef,{ status:n_status,"times._doc_":serverTimestamp(),Completed:arrayUnion(Consulting),Consulting:0 })
        : updateDoc(ROCRef,{ status:n_status,"times._doc_":serverTimestamp() })
    }
  })
}

export function CONSULTING_COMPLETED(No){
  let ID = parseInt(No);
  return updateDoc(ROCRef,{ Consulting:0,Completed:arrayUnion(ID),[`times._${ID}_`]:deleteField() })
}
export function CANCEL_BOOKING(No){
  let ID = parseInt(No);
  return new Promise(resolve => {
    getDoc(ROCRef).then(dSnap => {
      let Consulting = parseInt(dSnap.get('Consulting'));
      if(Consulting === ID) updateDoc(ROCRef,{ Cancelled:arrayUnion(ID),Consulting:0,[`times._${ID}_`]:deleteField() }).then(resolve)
      else updateDoc(ROCRef,{ Cancelled:arrayUnion(ID),Awaiting:arrayRemove(ID),[`times._${ID}_`]:deleteField() }).then(resolve)
    })
  })
}
export function CONSULT_FROM_AWAITING(No){
  let ID = parseInt(No);
  return updateDoc(ROCRef,{ Consulting:ID,Awaiting:arrayRemove(ID),[`times._${ID}_`]:deleteField() })
}

export function SET_BOOKINGS(updates){
  const update_data = { times:{ _doc_:serverTimestamp() } };
  ['Awaiting','Cancelled','Completed','Consulting'].forEach(key => {
    update_data[key] = updates[key];
  });
  return updateDoc(ROCRef,updates)
}


