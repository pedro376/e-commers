import { Link } from "react-router-dom";
import "../css/inicio.css";

function Inicio() {
    return(

        <main className="main">
            <section className="cue">
                <div className="cuello">
                    <div>
                        <h1 className="display">VISTE <br /> COMO <span>REY</span></h1>
                        <p>Jerseys originales y de colección de selecciones y clubes de todo el mundo. Cada camiseta que vendemos, la corona la trae puesta.</p>
                        <div class="cta-btn">
                            <a href="#colecciones"><button class="cta-btn" >Ver colección</button></a>
                        </div>
                    </div>
                    <div className="frame"> <img src="/img-promo/barcelona.jpeg" alt="" /></div>
                </div>
            </section>
            <section id='colecciones' className='seleccion'>
                <div className='wrap' id="wrap">
                    <div className='section-head'>
                        <div>
                            <div className='mensaje'><h3>Explora por reino</h3></div>
                            <div><h2>Compra por categoría</h2></div>
                        </div>
                        <p>De selecciones nacionales a clubes europeos y ediciones retro — cada colección tiene su propia corona.</p>
                    </div>
                    <div className="catalogo">

                        <Link to="/selecciones" className="catalogo-cart">
                            <img
                                src="/img-promo/seleccion-mexicana.jpeg"
                                alt="Selecciones"
                            />

                            <div className="label">
                                <div className="eyebrow">
                                    Colección
                                </div>

                                <h3 className="display">
                                    Selecciones
                                </h3>

                                <div className="count">
                                    Méxicanas· más
                                </div>
                            </div>
                        </Link>


                        <Link to="/clubes" className="catalogo-cart">
                            <img
                                src="/img-promo/real-madrid.jpeg"
                                alt="Clubes Europeos"
                            />

                            <div className="label">
                                <div className="eyebrow">
                                    Colección
                                </div>

                                <h3 className="display">
                                    Clubes Europeos
                                </h3>

                                <div className="count">
                                    Real Madrid · Barcelona · más
                                </div>
                            </div>
                        </Link>


                        <Link to="/retro" className="catalogo-cart">
                            <img
                                src="/img-promo/barcelona.jpeg"
                                alt="Retro y Vintage"
                            />

                            <div className="label">
                                <div className="eyebrow">
                                    Colección
                                </div>

                                <h3 className="display">
                                    Retro & Vintage
                                </h3>

                                <div className="count">
                                    Piezas de colección
                                </div>
                            </div>
                        </Link>

                    </div>
                </div>
            </section>
            <section className="masVendidas"  id="" >
                <div className="wrap">
                    <div className="section-head" >
                        <div>
                            <div className='mensaje'><h3>Síguenos</h3></div>
                            <div><h2>@KingdomJerseys.mx</h2></div>
                        </div>
                        <div className="linkInsta"><a href=""> <img src="/img-icon/instagram.png" alt="" />  <h4>Ver en Instagram </h4></a></div>
                    </div>
                    <div className="fotos">
                        <div className="imag">
                            <img src="img-promo/barcelona.jpeg" alt=""  alt="Selecciones" />
                        </div>
                        <div className="imag">
                            <img src="img-promo/1.jpeg" alt="" />
                        </div>
                        <div className="imag">
                            <img src="img-promo/2.jpeg" alt="" />
                        </div>
                        <div className="imag">
                            <img src="img-promo/3.jpeg" alt="" />
                        </div>
                        <div className="imag">
                            <img src="img-promo/real-madrid.jpeg" alt="" />
                        </div>
                    </div>                    
                </div>
            </section>
            <section>
                
            </section>
        </main>
    );
}

export default Inicio