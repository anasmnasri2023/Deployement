import React from "react";
import CardStats from "components/Cards/CardStats.js";

export default function HeaderStats() {
  return (
    <>
      <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
              <CardStats
                statSubtitle="USERS"
                statTitle="1,245"
                statArrow="up"
                statPercent="5.2"
                statPercentColor="text-emerald-500"
                statDescripiron="Since last week"
                statIconName="fas fa-users"
                statIconColor="bg-indigo-500"
                
              />
            </div>
            <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
              <CardStats
                statSubtitle="COURSES"
                statTitle="3,712"
                statArrow="up"
                statPercent="8.4"
                statPercentColor="text-emerald-500"
                statDescripiron="Since last month"
                statIconName="fas fa-book"
                statIconColor="bg-purple-500"
              />
            </div>
            <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
              <CardStats
                statSubtitle="BOOKINGS"
                statTitle="138"
                statArrow="down"
                statPercent="1.3"
                statPercentColor="text-red-500"
                statDescripiron="Compared to previous"
                statIconName="fas fa-calendar-check"
                statIconColor="bg-yellow-500"
              />
            </div>
            <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
              <CardStats
                statSubtitle="REVIEWS"
                statTitle="562"
                statArrow="up"
                statPercent="12"
                statPercentColor="text-emerald-500"
                statDescripiron="Since last month"
                statIconName="fas fa-star"
                statIconColor="bg-pink-500"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
