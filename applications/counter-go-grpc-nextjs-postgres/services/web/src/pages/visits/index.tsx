import Layout from "../../components/layout";

import VisitorCountChart from "./components/visitor-count-chart";

export const callApi = async (url) => {
  try {
    var response;
    response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('Error calling the API', error);
    throw error;
  }
};

const Demo = () => {
  return (
    <Layout>
      <div style={{width: '50%', height: '400px', margin: '0 auto'}}>
        <VisitorCountChart  />
      </div>
      
    </Layout>
  );
};


export default Demo;
