import "./SearchBar.css";

function SearchBar({search, setSearch, setActualPage})
{
    return(

        <div className="SearchBar">

            <input
            type="text"
            value={search}
            onChange={(e) => {
                setSearch(e.target.value);
                setActualPage(1);
            }}
            placeholder="Buscar productos..."
        />
            
        </div>
    )
}

export default SearchBar;