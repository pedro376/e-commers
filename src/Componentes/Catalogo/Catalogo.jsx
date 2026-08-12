import ProductCard from "../ProductCard/ProductCard";
import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import "./Catalogo.css";
import {productos} from "../../data/productos";

const normalizarTexto = (texto) =>
    texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

function Catalogo()
{
    {/* FILTRAR POR NOMBRE EN EL SEARCHBAR */}
    const [search, setSearch] = useState("");
    
    const productosFiltrados = productos.filter((producto) =>
        normalizarTexto(producto.nombre).includes(normalizarTexto(search))
    );

    {/* PAGINACIÓN CON BUTTONS Y FILTRADOS */}

    const productosPorPage = 28;
    const [actualPage, setActualPage] = useState(1);
    const indiceInicial = (actualPage - 1) * productosPorPage;

    const productosPagina = productosFiltrados.slice(
    indiceInicial,
    indiceInicial + productosPorPage
    );

    const totalPages = Math.ceil(
    productosFiltrados.length / productosPorPage
    );

    const maxPagesVisible = 4;

    const startPage = Math.max(
        1,
        Math.min(
            actualPage - 2,
            totalPages - maxPagesVisible + 1
        )
    );

    const endPage = Math.min(
        totalPages,
        startPage + maxPagesVisible - 1
    );

    const pages = Array.from(
        { length: endPage - startPage + 1 },
        (_, index) => startPage + index
    );

    

    return(
        <section className="Catalogo_Container">

            <SearchBar
                search = {search}
                setSearch = {setSearch}
                setActualPage = {setActualPage}
            />

            <div className="titulo">
                <h1>SELECCIONES</h1>
            </div>

            <div className="Product_Grid">
                {productosPagina.map((producto) => (
                    <ProductCard
                        key={producto.id}
                        producto={producto}
                    />
                ))}
            </div>

            <div className="pagination">

                {pages.map((page) => (
                    <button
                        key={page}
                        className={actualPage === page ? "active" : "disable"}
                        onClick={() => setActualPage(page)}
                    >
                        {page}
                    </button>
                ))}

            </div>

        </section>
    )
}

export default Catalogo;