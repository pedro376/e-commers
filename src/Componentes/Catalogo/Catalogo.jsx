import ProductCard from "../ProductCard/ProductCard";
import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import "./Catalogo.css";
import {productos} from "../../data/productos";

function Catalogo()
{

    const productosPorPage = 28;
    const [actualPage, setActualPage] = useState(1);
    const indiceInicial = (actualPage - 1) * productosPorPage;

    const productosPagina = productos.slice(
    indiceInicial,
    indiceInicial + productosPorPage
    );

    const totalPages = Math.ceil(
    productos.length / productosPorPage
    );



    return(
        <section className="Catalogo_Container">

            <SearchBar/>

            <div className="Product_Grid">
                {productosPagina.map((producto) => (
                    <ProductCard
                        key={producto.id}
                        producto={producto}
                    />
                ))}
            </div>

            <div className="pagination">

                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={actualPage === index + 1 ? "active" : "disable"}
                        onClick={() => setActualPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}

            </div>

        </section>
    )
}

export default Catalogo;