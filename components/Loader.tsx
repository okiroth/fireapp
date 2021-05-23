type LoaderState = {
  show: boolean
}

export default function Loader({ show }: LoaderState) {
  return show ? <div className="loader"></div> : null;
}