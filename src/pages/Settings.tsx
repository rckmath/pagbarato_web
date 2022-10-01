import { FunctionComponent } from 'react';

interface SettingsProps {}

const Settings: FunctionComponent<SettingsProps> = () => {
  return (
    <div className="flex flex-col w-full ">
      <h1 className="text-3xl font-semibold mb-2 text-[#0A0A0A]">Opções</h1>
      <hr />
    </div>
  );
};

export default Settings;
