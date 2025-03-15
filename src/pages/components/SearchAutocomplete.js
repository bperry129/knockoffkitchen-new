import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// SearchAutocomplete component for Pages Router
export default function SearchAutocomplete() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchItems, setSearchItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  // Fetch brands and products on component mount
  useEffect(() => {
    async function fetchSearchData() {
      try {
        setIsLoading(true);
        const recipesQuery = query(collection(db, "recipes"), orderBy("createdAt", "desc"));
        const recipesSnapshot = await getDocs(recipesQuery);
        
        if (recipesSnapshot.empty) {
          setSearchItems([]);
          setIsLoading(false);
          return;
        }
        
        const items = [];
        const brandSet = new Set();
        const productSet = new Set();
        
        recipesSnapshot.docs.forEach(doc => {
          const data = doc.data();
          
          // Add brand if not already added
          if (data.brandName && !brandSet.has(data.brandName)) {
            brandSet.add(data.brandName);
            items.push({
              id: `brand-${data.brandName}`,
              type: 'brand',
              name: data.brandName,
              slug: data.brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            });
          }
          
          // Add product if not already added
          if (data.productName && !productSet.has(data.productName)) {
            productSet.add(data.productName);
            items.push({
              id: `product-${data.productName}`,
              type: 'product',
              name: data.productName,
              slug: data.slug || data.productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            });
          }
        });
        
        setSearchItems(items);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching search data:', err);
        setIsLoading(false);
      }
    }
    
    fetchSearchData();
    
    // Add click outside listener to close results
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Filter items based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems([]);
      return;
    }
    
    const filtered = searchItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredItems(filtered);
  }, [searchTerm, searchItems]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowResults(true);
  };
  
  // Handle item selection
  const handleSelectItem = (item) => {
    setSearchTerm('');
    setShowResults(false);
    
    if (item.type === 'brand') {
      router.push(`/brand/${item.slug}`);
    } else {
      router.push(`/recipes/${item.slug}`);
    }
  };
  
  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === '') return;
    
    // If we have filtered results, navigate to the first one
    if (filteredItems.length > 0) {
      handleSelectItem(filteredItems[0]);
    } else {
      // Otherwise, go to search results page (if implemented)
      // router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  // Custom styles for the search box
  const searchBoxStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search recipes, brands..."
            className="pl-10 pr-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-white transition duration-300 text-white"
            style={searchBoxStyle}
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowResults(true)}
          />
          <i className="fas fa-search absolute left-3 top-3 text-white"></i>
        </div>
      </form>
      
      {/* Autocomplete results */}
      {showResults && filteredItems.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
          <ul className="py-1">
            {filteredItems.map(item => (
              <li 
                key={item.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handleSelectItem(item)}
              >
                <i className={`fas ${item.type === 'brand' ? 'fa-trademark' : 'fa-utensils'} mr-2 text-gray-500`}></i>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{item.type}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
