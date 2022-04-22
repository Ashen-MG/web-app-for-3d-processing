import {Scene} from "pages/home/Scene";
import {TopControlPanel} from "pages/home/components/panels/TopControlPanel";
import {SideControlPanel} from "pages/home/components/panels/SidebarControlPanel";
import {ConvertModal} from "pages/home/components/modals/ConvertModal";
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import {RootState} from "./store";
import {useAppSelector} from "./hooks";
import {useDispatch} from "react-redux";
import React, {useEffect, useState} from "react";
import {setFullscreen} from "./context/globalSlice";
import {ToastContainer} from "react-toastify";

export type UploadFile = File | undefined

export interface UploadedFileProp {
  uploadedFile: UploadFile
}

export interface UploadFileProps {
  uploadedFile: UploadFile,
  setUploadedFile: React.Dispatch<File | undefined>
}

export const App = () => {
  const dispatch = useDispatch();
  const fullscreenOn: boolean = useAppSelector((state: RootState) => state.global.fullscreen);

  const fullscreenHandler = useFullScreenHandle();

  /** Toggle fullscreen mode. */
  useEffect(() => {
    if (fullscreenOn)   fullscreenHandler.enter();
    else                fullscreenHandler.exit();
  }, [fullscreenOn]);

  // TODO: possibly move to TopControlPanel.tsx if redux states are going to work (and remove props from other components)
  /** Original uploaded 3D model.
   *  Unfortunately, we can't use Redux to store File since it isn't serializable.
   */
  const [uploadedFile, setUploadedFile] = useState<UploadFile>();

  return (
    <FullScreen handle={fullscreenHandler} onChange={(on) => dispatch(setFullscreen(on))}>
      <TopControlPanel uploadedFile={uploadedFile} setUploadedFile={setUploadedFile} />
      <div className="d-flex">
        <Scene uploadedFile={uploadedFile} />
        <SideControlPanel />
      </div>
      <ConvertModal uploadedFile={uploadedFile} />
      <ToastContainer limit={5} />
    </FullScreen>
  );
}