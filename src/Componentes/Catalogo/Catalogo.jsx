import ProductCard from "../ProductCard/ProductCard";
import SearchBar from "../SearchBar/SearchBar";
import "./Catalogo.css";

function Catalogo()
{
    return(
        <section className="Catalogo_Container">

            <SearchBar/>

            <div className="Product_Grid">
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
            </div>

        </section>
    )
}

export default Catalogo;