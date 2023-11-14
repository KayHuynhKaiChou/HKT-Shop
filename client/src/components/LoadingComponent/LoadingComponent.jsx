import { Spin } from "antd";


// eslint-disable-next-line react/prop-types
export default function LoadingComponent({isloading,children,delay = 500}) {
  return (
    <Spin spinning={isloading} size="large" delay={delay}>
        {children}
    </Spin>
  )
}
