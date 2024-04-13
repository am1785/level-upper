import React from "react";
import { Tabs, Tab, TabList, TabPanels, TabPanel, Icon, Select, VStack } from "@chakra-ui/react"

import { useQuery } from '@tanstack/react-query';
import LevelCardView from '../level/LevelCardView';
import LevelGraphView from "../level/LevelGraphView";

import { useCollectionsData } from "../../hooks/useCollectionsData";
import { useSkillsData } from "../../hooks/useSkillsData";

export type skill = {
    _id:string, // name of skill
    count:number,
    exp_earned:number
};

export default function Mylevel(){

    // TODO: IMPLEMENT user authentication
    const user = 'default';
    const [collection, setCollection] = React.useState<string>("");

    const { status, data, error } = useSkillsData(user, collection)
    const {  data:collectionData } = useCollectionsData(user);

      if (status === 'pending') {
        return <span>Loading...</span>
      }

      else if (status === 'error') {
        return <span>Error: {error.message}</span>
      }

      else { // or status === 'success', cache skills data into localStorage for future use
        if(collection === "") {
          // only update cache when fetching default collection
          let skillCache = [];
          for(let skill of data[0]["groupbySkill"]) {
            skillCache.push(skill._id);
          }
          localStorage['userSkills'] = JSON.stringify(skillCache);
        }
      }

    const handleCollectionFilter = (value:any) => {
      setCollection(value);
    }


    return (<>
    <main style={{minHeight: "100vh"}}>
      <Tabs isFitted variant='enclosed'>
        <TabList mb='1em'>
          <Tab>
            <Icon viewBox="0 0 576 512">
            <path
              fill="currentColor"
              d="M304 240V16.6c0-9 7-16.6 16-16.6C443.7 0 544 100.3 544 224c0 9-7.6 16-16.6 16H304zM32 272C32 150.7 122.1 50.3 239 34.3c9.2-1.3 17 6.1 17 15.4V288L412.5 444.5c6.7 6.7 6.2 17.7-1.5 23.1C371.8 495.6 323.8 512 272 512C139.5 512 32 404.6 32 272zm526.4 16c9.3 0 16.6 7.8 15.4 17c-7.7 55.9-34.6 105.6-73.9 142.3c-6 5.6-15.4 5.2-21.2-.7L320 288H558.4z"/>
            </Icon>
          </Tab>
          <Tab>
            <Icon viewBox="0 0 576 512">
              <path
                fill="currentColor"
                d="M284.3 11.7c-15.6-15.6-40.9-15.6-56.6 0l-216 216c-15.6 15.6-15.6 40.9 0 56.6l216 216c15.6 15.6 40.9 15.6 56.6 0l216-216c15.6-15.6 15.6-40.9 0-56.6l-216-216z"
              />
            </Icon>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel display={'flex'} justifyContent={'center'}>
            <VStack>
              <Select defaultValue={collection} placeholder='collection' size={'md'} mb={'1em'} onChange={(e) => handleCollectionFilter(e.currentTarget.value)}>
              {collectionData?.map((c:any, id:number) => (
                <option key={id} value={c}>{c}</option>
              ))}
              </Select>
              <LevelGraphView skillData={data[0]["groupbySkill"]} taskSizeData={data[0]["groupbySize"]}/>
            </VStack>
          </TabPanel>
          <TabPanel>
            <LevelCardView data={data[0]["groupbySkill"]} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </main>
    </>)

}