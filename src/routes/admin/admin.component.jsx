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
        {/* <ActionCard
          imgSrc={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAeFBMVEX///8AAABhYWGGhobZ2dnv7+/Pz8+tra1UVFT09PTh4eG5ubmBgYEwMDAPDw/8/Px2dnbn5+dERERbW1uwsLDS0tJsbGw2NjbIyMjx8fGbm5slJSUdHR0yMjLBwcFZWVmOjo6WlpakpKQLCwspKSlwcHBLS0sfHx8wKcqyAAAH8ElEQVR4nO2d63biOgxGw20oFBqgFGjp0NDbef83PLQzU2JZyJJjxwrL31+Cnb3s+CLJclFkXaFGt9Wm36Y2Tw9le3jl67aXQptdS4CvSfC+9X7bAt9yng7wpP0hNuAuKd+XVsOogIfUfF/6mMQD/JUa7q+iddVJarIf9SM1Yz81WE1RZg4tffSPZhEIb1JDmdo+hgZcpkayFLqnPqUGsvUUllBZJ/1WPyghKHwdcd6FuvyBzEfhahmZRT+EK9mtKdGM4RZxZi1hu4esbqBg+42hUewgVLEskYS9Y6Ba9BL2FmFqUUzYuw9Si2bC3iqEEUc1YW8fYO7SQ9jfI4h3zSdGPYSD4h5rxmnTWvQQnvZNFYbYdO5XRVjcYoi/mtWiixC8ThBEZYTF4zuC2GjHqI2wKD8Dt6I6Qtwy1qAVFRIWi6CtqJEQnTW8Jw2VhKjxyHfq10lYjBFEzwWcUkJs7n/zW4ZrJcT8YXuvzZRaQsynufWpRS8h5lB58ahFMSGG6GG70UyIdVS5BU41IYYodhTrJsRGVOniRjlhsbYRhQ5G7YRIJNNcVot6QmQZLvOu6CdENlOiAbUDhIiVUbIh7gJhsbIQBfuMThCWz5DwN7+WThBCT7XjaVPdIETsqOy1TUcIkZmfu1nsCmExgIRc/2lnCO3AH2Ysgx5CZ91WoDbPbqOHcFUNSFWWLXzDqkUPoYdYhvBOE7Lm/U4TsgabbhO+MWrpNmFv7a6l44Tv7lpSEoYIwHYPpykJywCEH85aUhIiO1u5nJUkJUTDZ4RyRjUnJQxxXOfVVUdaQjyUTSTnZj8xYXFo+i06jaepCYtiMhLKnEZvXOWnJxRrkglNZUKFyoRAmVChMiFQJlSoTAiUCRUqEwJlQoXKhECZUKEyIVAmVKhMCJQJFSoTAskIp8dF9JymA5dvPiLhpLmniCc6iCQe4eSuJUCHUzAeYQifNFdUAEI0wlZTgK5SEG7aJKSC8aMRtpuHl+imV0JIDKfRCNtNc0qcwYtG2G46bOJFohGGiNFii0p/GW8+bHG6II+lR1y1hQjSYumTPC0Sc+U9mrXBt3IsvSPvnkppfI9YztM+eX8IlAkVKhMCZUKFyoRAmVChMiFQJlSo6ycs59dOeNLw9eXKCU8qd7MrJ/zS7c21ExbFckbZ/7/VccJTb3U9oJ1wtFsfZ4uXz9Xn/WJ2PHhcCKmZcPjat12W7x/rpawUrYQ7LF/yXz1XgsR7OglHVjYaqP2Rm5FWI+GQ5wT64OVO1kc45d+xteEkNdNGOCE+P0SM7HvKCMWukTdn+j1VhBMfL6wr8a4mwgcPvpP29IijiNDfyUxmp9ND2MRzR7mM1RA2C4QgMitoIWx60eTlzGZKCOmox8XDpJzs6Fa+OKSKCJfrcXPdIgtKMqLs7t9YSY+1VQDCUJeyWhFd6E1WPzovzei0S+PGhEhqbU+BDR69kKkvWrCLPc7Ck/EkiRgyrUd0y5ihNXS56IaKTxiuCUEj/iYfNae6D/JZ9HIIPiFduEz1iBnHTG8GKTqGAuxT5BOGDIKuzsW60tKZhPSHiObc5xNiF6L5qrYE2ToelREi/ZRPiN2H5qtzGzo3hDJCJLaYTyjbfHNfW/Aoi9BOaZomVv9nEnfvmISE9k5KMONbqd+9dV4mu5+VElqhqQJC5NIXT/3MzO4XFhNaX6JkXRqon87P8z0j/l9MCDOZi/YW5cOv5qoZ5DmGGTEhPIySdH/IGZ7lhMCkkZSQ8boehGCsSUnIGrrkhGBzlpKQZV3zIDRPL6YkZK10PQjN0TQhoX21SiBC80hRQkLe9OpDaJj5ExIeoxEaR1ISEmL2zznUs7mSXv8HH8A+5qr+l4SE1rsNlj5XqZZDa+FgDDUJCcFr3cmCSOqCdyVtL//YJuEjeC3PC42/BREv/9YmITBBMe5xIHQ0C6v39nSE5saCcxcHIWCurpvc0hGad+F6XINryPTO1T9pLYTO9PgOmWvc+pR/nYT1sDct32HTXmq6WHX0UmDCaFYYGGnqM8+VzBbAY6NjtjAPhlhuU5Gge0cHoWWlkV5HfRa8hN0w7ScktLxOC+edMaiGVpyD4YFKSIgGYNwBWftD+ACWvKqq/yUhIS+0o8s74Ou3YsDtUzhC4y/ZmhhTziMHnoR6LMJwGgtFqMeqf/2eGZbjotveNWhACkM4oSppO4KWDmnzI4QXsaUlZEQDthqpEEHulKhtRpvEkK6IoSgKTWjnsktNqClyL5JcYasyQuTYRXLCsBG0SKR3ckLHUQRgg3PsmrG8rukJHVHClfEsHWyO3rqqgJA+jWDeLU4++oa6kBUQOsbTes+jOyl+0tL80GHkYkuit8JnEz29Ur+QXBlYnv0slo1Ff17/TMV0HNxF7xV4buwTDtFc9Mm7zW5UjA70Cb7LH1jTo41NNOYiukWMIKGO3HmpNkE3S2pPZR6gx+rIqo9sxwblXDh6qKCbGq/mn2qauiui4BlL4qlu+Zu+eRWxdXoeQx67E2tfH7tLn4+ROKj+U27w15bIPE8q76mOHvpHnvkoAslsg5Jl6v8RI3vLt1q9YMUSsOAu+VPjAjlQqRIRjvVT3kHAgSiacbqPTEHKWlI+PrneZytfXiZd21T2+wyry6cB50deEiyg8jXkSV+h+liLTMcL+5W2M2FGOkOj28FH9HvVUL0sLnS6yfAwHiw2p0c2i2p8mKbZ+mSl0v84cYOH1LwFOQAAAABJRU5ErkJggg=="}
          title={"Add Order"}
          text={"this action adding new order to DB"}
          buttonText={"Add Order"}
          buttonColor={"success"}
          onClickHandler={""}
        ></ActionCard> */}
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
