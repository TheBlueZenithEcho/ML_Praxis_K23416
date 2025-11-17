import React from 'react';
import TopwordBox from '@/components/admin/TopwordBox';
import ChartBox from '@/components/admin/ChartBox';
import SentimentChartBox from '@/components/admin/SentimentChart';

const Ad_Home = () => {
  return (
    <div className='ad_home '>
      <div className="box box1 ">
        <TopwordBox />
      </div>

      <div className="box box2 ">
        <ChartBox type="users" />
      </div>
      <div className="box box3 ">
        <ChartBox type="designers" />
      </div>

      <div className="box box4">
        <SentimentChartBox />
      </div>
    </div>
  );
};

export default Ad_Home;