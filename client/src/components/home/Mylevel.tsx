import { Tabs, Tab, TabList, TabPanels, TabPanel, Icon, Box } from "@chakra-ui/react"
import * as skillsApi from '../../api/skills';
import { useQuery } from '@tanstack/react-query';
import LevelCardView from '../level/LevelCardView';
import LevelGraphView from "../level/LevelGraphView";

export type skill = {
    _id:string, // name of skill
    count:number,
    exp_earned:number
};

export default function Mylevel(){

    const user = 'default';

    const { status, data, error } = useQuery({
        queryFn: () => skillsApi.fetchSkills(user),
        queryKey: ['fetchSkills', { user }],
      })

      if (status === 'pending') {
        return <span>Loading...</span>
      }

      else if (status === 'error') {
        return <span>Error: {error.message}</span>
      }

      else { // or status === 'success'
        // console.log(data);
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
            <LevelGraphView data={data}/>
          </TabPanel>
          <TabPanel>
            <LevelCardView data={data} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </main>
    </>)

}