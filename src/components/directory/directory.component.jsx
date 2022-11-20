import DirectoryItem from '../directory-item/directory-item.component';

import { DirectoryContainer } from './directory.styles';
import { useEffect,useState } from 'react';
import { getCategories } from '../../utils/server/serverService';


const Directory = () => {
  let categoriesArray;
  const [categories, setCategories] = useState(categoriesArray);
  useEffect(() => {
    const getCategoriesMap = async () => {
      categoriesArray = await getCategories();
      setCategories(categoriesArray);
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
