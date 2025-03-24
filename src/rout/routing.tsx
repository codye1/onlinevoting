import { Route, Routes } from 'react-router-dom';
import { routPages } from './route-page.ts';

const Routing = () => {
  return (
    <Routes>
      {routPages.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={<route.element />}
        ></Route>
      ))}
    </Routes>
  );
};

export default Routing;
