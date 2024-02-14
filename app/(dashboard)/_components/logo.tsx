import Image from "next/image";
const Logo = () => {
    return ( 
        <Image
        height={180}
        width={605}
        alt="logo"
        src={"/digi.png"}
        />
     );
}
 
export default Logo;