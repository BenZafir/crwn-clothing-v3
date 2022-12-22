import ActionCard from '../../components/action-cards/action-card'
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import AdminTable from '../../components/admin-table/admin-table';
import { selectCurrentUser } from '../../store/user/user.selector';
import { getItems, getUsers, getCategories, getOrders, deleteFromTable, updateValueInTable, setNewValueInTable } from '../../utils/server/serverService';

function Admin() {
  const currentUser = useSelector(selectCurrentUser);
  const [deleteObject, setDeleteObject] = useState({});
  const [updateObject, setUpdateObject] = useState({});
  const [items, setitems] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(async () => {
    await fetchItems()
    await fetchUsers()
    await fetchOrders()
    await fetchCategoris()
  }, [deleteObject, updateObject])

  const catrgoryUpdateObject = [
    { fieldName: "Name", fieldType: "text", placeholder: "name" },
    { fieldName: "Image", fieldType: "text", placeholder: "imageUrl" },
  ]
  const itemUpdateObject = [
    { fieldName: "Name", fieldType: "text", placeholder: "name" },
    { fieldName: "Price", fieldType: "number", placeholder: "price" },
    { fieldName: "Image", fieldType: "text", placeholder: "imageUrl" },
    { fieldName: "Category", fieldType: "text", placeholder: "category" },
  ]
  const userUpdateObject = [
    { fieldName: "Name", fieldType: "text", placeholder: "name" },
    { fieldName: "Email", fieldType: "email", placeholder: "email" },
    { fieldName: "isAdmin", fieldType: "checkbox", placeholder: "isAdmin" },
  ]
  const orderUpdateObject = [
    { fieldName: "itemId", fieldType: "list", placeholder: "Enter itemId" },
  ]


  const fetchUsers = async () => {
    let fetchUsers = await getUsers();
    let users = fetchUsers.map(u => { u.isAdmin = u.isAdmin ? "yes" : "no"; return u })
    setUsers(users)
  }

  const fetchItems = async () => {
    let fetchItems = (await getItems(true))?.list;
    setitems(fetchItems)
  }

  const fetchOrders = async () => {
    let fetchOrders = await getOrders();
    setOrders(fetchOrders)
  }

  const fetchCategoris = async () => {
    let fetchCategories = await getCategories();
    let categories = fetchCategories.map(c => {
      delete c.imageUrl;
      return c;
    })
    setCategories(categories)
  }


  const handleDelete = (tableString, td) => {
    if (tableString == 'user' && currentUser.name == td.name) {
      alert("can not delete currnt user")
    } else {
      deleteFromTable(tableString, td).then((result) => {
        setDeleteObject(result);
      });
    }
  }


  const onUpdateHandler = (table, arg) => {
    if (table == 'user' && currentUser.name == arg.name) {
      alert("can not update currnt user")
    } else {
      updateValueInTable(table, arg).then((result) => {
        setUpdateObject(result);
      });
    }
  }

  const onPustHandler = (table, arg) => {
    setNewValueInTable(table, arg).then((result) => {
      setUpdateObject(result);
    });
  }

  const [key, setKey] = useState('Users');


  return (
    <Tabs
      id="controlled-tab"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3"
    >
      <Tab eventKey="Users" title="Users">
        {users.length > 0 &&
          <AdminTable thArr={Object.keys(users[0])}
            tdArr={users}
            customObject={userUpdateObject}
            onSendHendler={(arg) => onUpdateHandler("user", arg)}
            handleDelete={(td) => handleDelete("user", td)}>
          </AdminTable>
        }
      </Tab>
      <Tab eventKey="Items" title="Items">
        {items.length > 0 &&
          <AdminTable
            thArr={Object.keys(items[0])}
            tdArr={items}
            customObject={itemUpdateObject}
            onSendHendler={(arg) => onUpdateHandler("item", arg)}
            handleDelete={(td) => handleDelete("item", td)}></AdminTable>
        }
      </Tab>
      <Tab eventKey="Orders" title="Orders">
        {orders.length > 0 &&
          <AdminTable
            thArr={Object.keys(orders[0])}
            tdArr={orders}
            customObject={orderUpdateObject}
            //onSendHendler={(arg) => onUpdateHandler("order",arg)}
            handleDelete={(td) => handleDelete("order", td)}></AdminTable>
        }
      </Tab>
      <Tab eventKey="Categories" title="Categories">
        {categories.length > 0 &&
          <AdminTable
            thArr={Object.keys(categories[0])}
            tdArr={categories}
            handleDelete={(td) => handleDelete("category", td)}
            customObject={catrgoryUpdateObject}
            onSendHendler={(arg) => onUpdateHandler("category", arg)}
          ></AdminTable>
        }
      </Tab>
      <Tab eventKey="Actions" title="Actions" style={{ width: '30rem', display: 'flex', justifyContent: 'space-between' }}>
        <ActionCard
          imgSrc={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHYf6lgXqsECDZxzK6K8byeu16k_isYxQb_w&usqp=CAU"}
          title={"Add Item"}
          text={"this action add new item to DB"}
          buttonText={"Add Item"}
          buttonColor={"success"}
          onSendHendler={(arg) => onPustHandler("item", arg)}
          customObject={itemUpdateObject}
        ></ActionCard>
        <ActionCard
          imgSrc={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADgCAMAAADCMfHtAAAAdVBMVEX///8AAADw8PCxsbGOjo76+vri4uLGxsaHh4eLi4uAgIAoKCjQ0NBiYmK9vb1aWlofHx/r6+vX19dLS0uYmJg1NTX29vZQUFB4eHjR0dGmpqZwcHDDw8NoaGhCQkJeXl4WFhYMDAytra0xMTGfn5+VlZVDQ0MhZJjlAAAEeUlEQVR4nO2d61bqMBBGA+UmcigIlPtNi+//iAcoYEsvidOZCcv17X8uJZ/bNqEmZGLMD01u2saJiDs3KkxZTRr8zKZjm95g8c6fO1pvnnNO/Ck3tpWOg5lU7nGYzhmPpHIuDMv0jOlJ5m5/cj4kc86sygRD2dzZfRzoyOac6RYL/pPOnd+CvqSDGo3Cwe1TPje+BsXyQeku8aCtkNu4DnMaQY2CAXWqkds7B3U1ghqnvKHo+P3gHPSmErTLCcqPb1c+jNnpJOXGmkAnN9a6WfIdUaUbXrtH+st9wEnm/u88G2a+y5obpC9aP2v4VjCo08mMYdWGrLkm/Sj/ZNhjDYIhDMnAkA0YwpAMDNmAIQzJwJANGMKQDAzZgCEMycCQDRjCkAwM2YAhDMnAkA0YwpAMDNmAIQzJwJANGMKQDAzZgCEMycCQDRjCkAwM2YAhDMnAkA0YwpAMDNmAIQzJwJANGMKQDAzZgCEMycCQDRjCkAwM2YAhDMlUGPLWxRi8oOHk1GJk7W7Imts6ZG/L9JeC5OrTyFX5y9AyZq6TlCsSOdTJXRnTUgma5TrLWCX3UidKuqRgwjQ/HojVhMzwPPKIUVCvTaHk3u3dQaNDLIoG9aNCcFJiTGGsKSxGq1ALL0iSIvGgjyJBhUHucetIl79bFgsas7a/tg6pvtGWqCF8Z1ZRZld0tMkWhg3ESu+VFqBNbp+tVG6Y+8MOejvuB7jjbFFSfTbF+DNkf786zOPcc/DtbuXFaieU6x4MAAAAAAAAABT++L8dwzX7FO3o2+E/YC3ETio4fvpWS5CcMt1ZD7WSR/a4p9LpUnfanW6egftfztuMsCPNsmnVr8CxBcnJ0oRjHcGqyf+5/eVGZ2WmTxesXv0LXZpQWV1rkg0tv57DjaqzQhpTBQeWhvOLyzl0TrSZUA2thzXZ7w7h8+vuUB8Iresa9nFapRsWLnM7YT1fb2BtIv3Tmp8Y8mOo+akvR5gNNT+55wgMYWhgWAcYOgFDGBoY1gGGTsAQhgaGdYChEzCEoYFhHWDoBAzLtzo8eAHDaDksY2Nd+ptuyl7bHb+I4dh6mch8DV/B0La4VI++f0PpHUlT74biS+xjz4bSl/ByEf0aym8kDT0byu+zfvdsaF3Ers0IhjCEIQxhCEMYwhCGMIQhDGEIQxjCkMEwFjfceTaUnfFOnPwamqO04dK3ofSuq9D7rL5ZiAoe2v4NzUpQcHupKujd0LSD/j4sYW/d3jope2m4jpMlUv+GlTDse3pxQ3xSAYYGhnWAoRMwhKGBYR1g6AQMYWhgWAcYOgFDGBrJuhivaLgPOMmsSXg0PNqa4MFjfZpvDT96jSEGQ/n1rQsOBavEDBVOezlz8mhobE2wQK4OybDvSXTd4M6aKmj6tqZdBmmFal8R2dBaWNWlEfldHQ59pYy2pWm3h5SlsKBrEc5CLJ3I8V2oI1qitcYVvNCratu9MqrceYuL2gWmy3cO/aqAb7Sa859meZiv6GU9U2wKawFOf1/aNmryQh9BOfkPoC+JSMrWu64AAAAASUVORK5CYII="}
          title={"Add Category"}
          text={"this action add new category to DB"}
          buttonText={"Add Category"}
          buttonColor={"success"}
          onSendHendler={(arg) => onPustHandler("category", arg)}
          customObject={catrgoryUpdateObject}
        ></ActionCard>
      </Tab>
    </Tabs>

  );
}

export default Admin;
