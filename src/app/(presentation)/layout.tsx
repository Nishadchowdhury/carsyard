import { PropsWithChildren } from "react";

interface pageProps {
    props: PropsWithChildren,
    children: React.ReactNode
}
const layout: React.FC<pageProps> = (props) => {
    return props.children
}

export default layout;