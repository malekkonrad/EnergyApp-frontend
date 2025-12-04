// import { useOptimalWindow } from '../../hooks/useOptimalWindow';
// import { ChargingForm } from './ChargingForm';
// import { ChargingResult } from './ChargingResult';
// import { Loader } from '../common/Loader';
// import { ErrorMessage } from '../common/ErrorMessage';



//   return (
//     <section
//       id="ev-charging"
//       className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-8 text-white shadow-2xl"
//     >
//       <div className="mx-auto max-w-2xl">
//         <div className="mb-8 text-center">
//           <h2 className="text-3xl font-bold tracking-tight">
//             Optimal EV charging window
//           </h2>
          
//         </div>

//         <ChargingForm onSubmit={calculate} />

//         {loading && (
//           <div className="mt-6 flex justify-center">
//             <Loader />
//           </div>
//         )}

//         {error && (
//           <div className="mt-6 flex justify-center">
//             <ErrorMessage message={error} />
//           </div>
//         )}

//         {result && !loading && !error && (
//           <div className="mt-6">
//             <ChargingResult result={result} />
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };


import React, { useState } from 'react';
import { ChargingForm } from './ChargingForm';
import { ChargingResult } from './ChargingResult';
import { Card } from '../common/Card';
import type { OptimalWindowRequest, OptimalWindowResponse } from '../../api/types';
import { useOptimalWindow } from '../../hooks/useOptimalWindow';
import styles from './ChargingSection.module.css';


// export const ChargingSection = () => {
//   const { result, loading, error, calculate } = useOptimalWindow();


export const ChargingSection: React.FC = () => {
  // const [result, setResult] = useState<OptimalWindowResponse | null>(null);
  // const { findOptimalWindow, loading, error } = useOptimalWindow();

  // const handleSubmit = async (params: OptimalWindowRequest) => {
  //   const data = await findOptimalWindow(params);
  //   if (data) {
  //     setResult(data);
  //   }
  // };

  const { result, loading, error, calculate } = useOptimalWindow();

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Optimal Charging Window</h2>
      <Card>
        <ChargingForm onSubmit={calculate} />
        {error && <p className={styles.error}>{error}</p>}
        {result && <ChargingResult result={result} />}
      </Card>
    </section>
  );
};