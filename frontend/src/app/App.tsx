import {Scene} from "pages/home/Scene";
import {TopControlPanel} from "pages/home/components/panels/TopControlPanel";
import {SidebarControlPanel} from "pages/home/components/panels/SidebarControlPanel";
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import {RootState} from "./store";
import {useAppSelector} from "./hooks";
import {useDispatch} from "react-redux";
import React, {useEffect, useState} from "react";
import {setFullscreen} from "./context/globalSlice";
import {ConvertModal} from "../pages/home/components/modals/ConvertModal";

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

  // TODO: react router implementation (possibly... not needed right now)

  const fullscreenHandler = useFullScreenHandle();

  /** Uploaded 3D model
   *  Unfortunately, we can not use Redux to store File because it is not serializable).
   *  Usually */
  const [uploadedFile, setUploadedFile] = useState<UploadFile>();

  /** Toggle fullscreen mode. */
  useEffect(() => {
    if (fullscreenOn)
      fullscreenHandler.enter();
    else
      fullscreenHandler.exit();
  }, [fullscreenOn]);

  return (
    <FullScreen handle={fullscreenHandler} onChange={(on) => dispatch(setFullscreen(on))}>
      <TopControlPanel uploadedFile={uploadedFile} setUploadedFile={setUploadedFile} />
      <div className="d-flex">
        <Scene uploadedFile={uploadedFile} />
        <SidebarControlPanel />
      </div>
      <ConvertModal uploadedFile={uploadedFile} />
    </FullScreen>
  );
}