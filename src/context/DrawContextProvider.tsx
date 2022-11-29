import React,{ createContext, useContext, useState } from "react";


type ContextType ={
    queries:string[];
    currentStep:number;
    setCurrentStep:(value:number)=>void;
    onDraw:()=>void
}

export const DrawContext = createContext<ContextType>({} as ContextType);

export const useDrawContext=()=>{
    const context  = useContext(DrawContext);
    return {...context}
}

export const DrawContextProvider =({children})=>{
    const [queries, setQueries] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState<number>(0)
    const onDraw=()=>{
        setQueries(['test','onclick'])
    }

    
    return(
        <DrawContext.Provider value={{queries,currentStep,setCurrentStep,onDraw}}>
            {children}
        </DrawContext.Provider>
    )
}