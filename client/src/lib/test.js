
const isLoggedIn = () => {
  const token = jsCookie.get('token');
  return token ? true : false 
}

console.log(isLoggedIn());