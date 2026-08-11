import "./ProductCard.css";

function ProductCard()
{
    return(
        <article className="productCard">

            <img className="productImg" src="public\playera.jpeg" alt="Producto"></img> {/*Imagen que traeremos desde Shopify*/}

            <div className="info">

                <div className="row">

                <h3>Product Name</h3>
                <span>$000</span>

            </div> {/*Este div contendrá name y precio en la misma linea*/}
            
            <div className="row">

                <h5>Selección</h5>
                <del>$000</del>

            </div> {/*Este div contendrá club/selección y descuento (si lo hay) en una sola linea*/}

            </div>

            <div className="buttons">

                <select className="talla" id="size"> {/*Cambiar id y options con shopify*/}
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="XL">XL</option>
                </select>

                <button className="toCart">AGREGAR AL CARRITO</button>
            </div> {/*Buttons de piezas y agregar al carrito*/}

        </article>
    );
}

export default ProductCard;