import { isObservable, of } from "rxjs";

const just = o => isObservable(o) ? o : of(o);

export default just;
