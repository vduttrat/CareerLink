import workshop from "./workshop.png"
export default function Hero(){
    function handleClick(){
        const hgt = window.innerHeight;
        window.scrollTo(0,hgt);
    }
    return(
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 vw-100" style={{backgroundImage:`url(${workshop})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', minHeight: '100vh', backgroundAttachment:"fixed"}}>
            <h1 className="badge text-light p-0 m-0" style={{fontSize:"8rem", textShadow:"2px 2px 5px"}}>CareerLink</h1>
            <p className="text-light fs-1"><span className="text-bg-light text-dark rounded p-2 fw-bold">ELEVATE</span> YOUR NETWORK</p>
            <button className="btn btn-dark text-light fs-4 rounded-3 border-5 border-light" onClick={handleClick}>CONTINUE</button>
        
        </div>
    )
}
