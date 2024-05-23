import HeaderComponent from '../HeaderComponent/HeaderComponent'

export default function DefaultComponent({children}) {
  return (
    <>
      <HeaderComponent />
      {children}
    </>
  )
}
