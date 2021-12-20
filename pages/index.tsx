import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import * as tf from "@tensorflow/tfjs";

import RecorderControls from "../components/RecorderControls";
import RecordingsList from "../components/RecordingList";
import useRecorder from "../hooks/useRecorder";
import { UseRecorder } from "../types/recorder";

const Home: NextPage = () => {
  const [model, setModel] = useState<any>();

  useEffect(() => {
    const loadModel = async () => {
      const model = await tf.loadLayersModel("/tfModel/model.json");
      console.log(model);
      setModel(model);
      // model.predict()
    };

    tf.ready().then(() => {
      loadModel();
    });
  }, []);

  const { recorderState, ...handlers }: UseRecorder = useRecorder();
  const { audio } = recorderState;

  return (
    <div className={styles.container}>
      <Head>
        <title>Speech Commands</title>
        <meta name="description" content="Speech Commands Demo" />
        <link rel="icon" href="/favicon.ico" />
        <script src="/wasm/mfcc.js"></script>
      </Head>

      <main className={styles.main}>
        <section className="voice-recorder">
          <h1 className="title">Speech Commands</h1>
          <div className="recorder-container">
            <RecorderControls
              recorderState={recorderState}
              handlers={handlers}
            />
            <RecordingsList audio={audio} />
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>Team 8</span>
      </footer>
    </div>
  );
};

export default Home;
