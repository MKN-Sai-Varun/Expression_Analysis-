"use client";
import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

function BC({ labels, dataPoints }) {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth * 0.4, // 80% of viewport width
    height: window.innerHeight * 0.5, // 60% of viewport height
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth * 0.4,
        height: window.innerHeight * 0.5,
      });
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup the listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const chartData = labels.map((label, index) => {
    const colors = {
      angry: "var(--color-chrome)",
      sad: "var(--color-safari)",
      happy: "var(--color-firefox)",
      surprise: "var(--color-edge)",
      fear: "var(--color-other)",
      neutral: "var(--color-opera)",
    };
    return {
      browser: label,
      level: dataPoints[index],
      fill: colors[label] || "var(--color-brave)", // Default to Brave color if no match
    };
  });

  return (
    <div style={{ width: "100%" }}>
      <p style={{marginLeft:"5vw",marginTop:"1vh",fontSize:"1.7rem"}}>Emotion-Bar</p>
      <BarChart
        width={dimensions.width}
        height={dimensions.height}
        data={chartData}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
      >
        <YAxis
          dataKey="browser"
          type="category"
          tickLine={false}
          axisLine={false}
          tickMargin={5}
        />
        <XAxis type="number" hide />
        <Tooltip />
        <Bar dataKey="level" layout="vertical" radius={5} />
      </BarChart>
    </div>
  );
}

export default BC;
// "use client";
// import React from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

// function BC({ labels, dataPoints }) {
//   const chartData = labels.map((label, index) => {
//     const colors = {
//       angry: "var(--color-chrome)",
//       sad: "var(--color-safari)",
//       happy: "var(--color-firefox)",
//       surprise: "var(--color-edge)",
//       fear: "var(--color-other)",
//       neutral: "var(--color-opera)",
//     };
//     return {
//       browser: label,
//       level: dataPoints[index],
//       fill: colors[label] || "var(--color-brave)", // Default to Brave color if no match
//     };
//   });

//   return (
//     <div style={{ width:"100%",height:"400"}}>
//       <p>Emotion-Bar</p>
//       <BarChart
//        height={window.innerWidth*0.2}
//        width={window.innerHeight*0.6}
//         data={chartData}
//         layout="vertical"
//         margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
//       >
//         <YAxis
//           dataKey="browser"
//           type="category"
//           tickLine={false}
//           axisLine={false}
//           tickMargin={5}
//         />
//         <XAxis type="number" hide />
//         <Tooltip />
//         <Bar dataKey="level" layout="vertical" radius={5} />
//       </BarChart>
//     </div>
//   );
// }

// export default BC;
// "use client"
// // import { Bar } from 'react-chartjs-2';
// // import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// // ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
// import React from 'react';
// import { TrendingUp } from "lucide-react"
// import { Bar, BarChart, XAxis, YAxis } from "recharts"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "./card.jsx"
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"
// function BC({labels,dataPoints}){
//     const chartData=[];
//     for(let i=0;i<labels.length;i++){
//         if(labels[i]==="angry"){
//             chartData.push({browser:labels[i],level:dataPoints[i],fill:"var{--color-chrome)"});
//         }else if(labels[i]==="sad"){
//             chartData.push({browser:labels[i],level:dataPoints[i],fill:"var{--color-safari)"});
//         }else if(labels[i]==="happy"){
//             chartData.push({browser:labels[i],level:dataPoints[i],fill:"var{--color-firefox)"});
//         }else if(labels[i]==="surprise"){
//             chartData.push({browser:labels[i],level:dataPoints[i],fill:"var{--color-edge)"});
//         }else if(labels[i]==="fear"){
//             chartData.push({browser:labels[i],level:dataPoints[i],fill:"var{--color-other)"});
//         }else if(labels[i]==="neutral"){
//             chartData.push({browser:labels[i],level:dataPoints[i],fill:"var{--color-opera)"});
//         }else{
//             chartData.push({browser:labels[i],level:dataPoints[i],fill:"var{--color-brave)"});
//         }
//     }
//     const chartConfig = {
//         level: {
//             label: "level",
//         },
//         chrome: {
//             label: "Chrome",
//             color: "hsl(var(--chart-1))",
//         },
//         safari: {
//             label: "Safari",
//             color: "hsl(var(--chart-2))",
//         },
//         firefox: {
//             label: "Firefox",
//             color: "hsl(var(--chart-3))",
//         },
//         edge: {
//             label: "Edge",
//             color: "hsl(var(--chart-4))",
//         },
//         other: {
//             label: "Other",
//             color: "hsl(var(--chart-5))",
//         },
//         opera: {
//             label:"Opera",
//             color:"hsl(var(--chart-6))",
//         },
//         brave: {
//             label:"Brave",
//             color:"hsl(var(--chart-7))",
//         },
//     }
//     return (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Bar Chart - Mixed</CardTitle>
//                 <CardDescription>January - June 2024</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ChartContainer config={chartConfig}>
//                   <BarChart
//                     accessibilityLayer
//                     data={chartData}
//                     layout="vertical"
//                     margin={{
//                       left: 0,
//                     }}
//                   >
//                   <YAxis
//                     dataKey="browser"
//                     type="category"
//                     tickLine={false}
//                     tickMargin={10}
//                     axisLine={false}
//                     tickFormatter={(value) => {
//                         const label = chartConfig[value]?.label;
//                         return label || value; 
//                     }}
//                   />
//                     <XAxis dataKey="level" type="number" hide />
//                     <ChartTooltip
//                       cursor={false}
//                       content={<ChartTooltipContent hideLabel />}
//                     />
//                     <Bar dataKey="level" layout="vertical" radius={5} />
//                   </BarChart>
//                 </ChartContainer>
//               </CardContent>
//               <CardFooter className="flex-col items-start gap-2 text-sm">
//                 <div className="flex gap-2 font-medium leading-none">
//                   Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//                 </div>
//                 <div className="leading-none text-muted-foreground">
//                   Showing total visitors for the last 6 months
//                 </div>
//               </CardFooter>
//             </Card>
//     )



// }
// export default BC;
// "use client"
// import { TrendingUp } from "lucide-react"
// import { Bar, BarChart, XAxis, YAxis } from "recharts"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"
// const chartData = [
//   { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
//   { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
//   { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
//   { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
//   { browser: "other", visitors: 90, fill: "var(--color-other)" },
// ]

// for(let i=0;i<labels.length;i++){
//     if(labels[i]==="angry"){
//         charData.push({browser:labels[i],level:dataPoints[i],fill:"var{--color-chrome)"});
//     }else if(labels[i]==="sad"){
//         charData.push({browser:labels[i],level:dataPoints[i],fill:"var{--color-safari)"});
//     }else if(labels[i]==="happy"){
//         charData.push({browser:labels[i],level:dataPoints[i],fill:"var{--color-firefox)"});
//     }else if(labels[i]==="surprise"){
//         charData.push({browser:labels[i],level:dataPoints[i],fill:"var{--color-edge)"});
//     }else if(labels[i]==="fear"){
//         charData.push({browser:labels[i],level:dataPoints[i],fill:"var{--color-other)"});
//     }else if(labels[i]==="neutral"){
//         charData.push({browser:labels[i],level:dataPoints[i],fill:"var{--color-opera)"});
//     }else{
//         charData.push({browser:labels[i],level:dataPoints[i],fill:"var{--color-brave)"});
//     }
// }
// const chartConfig = {
//   level: {
//     label: "level",
//   },
//   chrome: {
//     label: "Chrome",
//     color: "hsl(var(--chart-1))",
//   },
//   safari: {
//     label: "Safari",
//     color: "hsl(var(--chart-2))",
//   },
//   firefox: {
//     label: "Firefox",
//     color: "hsl(var(--chart-3))",
//   },
//   edge: {
//     label: "Edge",
//     color: "hsl(var(--chart-4))",
//   },
//   other: {
//     label: "Other",
//     color: "hsl(var(--chart-5))",
//   },
//   opera: {
//     label:"Opera",
//     color:"hsl(var(--chart-6))",
//   },
//   brave: {
//     label:"Brave",
//     color:"hsl(var(--chart-7))",
//   },
// } satisfies ChartConfig
// export function Component() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Bar Chart - Mixed</CardTitle>
//         <CardDescription>January - June 2024</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <BarChart
//             accessibilityLayer
//             data={chartData}
//             layout="vertical"
//             margin={{
//               left: 0,
//             }}
//           >
//             <YAxis
//               dataKey="browser"
//               type="category"
//               tickLine={false}
//               tickMargin={10}
//               axisLine={false}
//               tickFormatter={(value) =>
//                 chartConfig[value as keyof typeof chartConfig]?.label
//               }
//             />
//             <XAxis dataKey="visitors" type="number" hide />
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Bar dataKey="visitors" layout="vertical" radius={5} />
//           </BarChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col items-start gap-2 text-sm">
//         <div className="flex gap-2 font-medium leading-none">
//           Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="leading-none text-muted-foreground">
//           Showing total visitors for the last 6 months
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }












// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
// const BarChart = ({ labels, dataPoints }) => {
//     const data = {
//         labels: labels,
//         datasets: [
//             {
//                 label: 'Sample Data',
//                 data: dataPoints,
//                 backgroundColor: 'rgba(75, 192, 192, 0.5)',
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 borderWidth: 1,
//             },
//         ],
//     };
//     const options = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: 'top',
//             },
//             title: {
//                 display: true,
//                 text: 'Bar Chart Example',
//             },
//         },
//     };

//     return <Bar data={data} options={options} />;
// };

// export default BarChart;