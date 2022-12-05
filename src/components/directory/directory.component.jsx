import DirectoryItem from '../directory-item/directory-item.component';

import { DirectoryContainer } from './directory.styles';
import { useEffect,useState } from 'react';
import { getCategories } from '../../utils/server/serverService';


const Directory = () => {
  let categoriesArray;
  const [categories, setCategories] = useState(categoriesArray);
  useEffect(() => {
    const getCategoriesMap = async () => {
      try{
        categoriesArray = await getCategories();
        setCategories(categoriesArray);
      } catch(error){
        alert("failed to get the categories from server")
      }
    };
    getCategoriesMap();
  }, []);

  return (
    <DirectoryContainer>
      {categories?.map((category) => (
        <DirectoryItem key={category.id} category={category} />
      ))}
    </DirectoryContainer>
  );
};

export default Directory;
