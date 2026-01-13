import DropDown from '@components/DropDown.tsx';
import SettingSection from '@components/SettingSection.tsx';
import DateTimePicker from 'react-datetime-picker';

import {
  categoryOptions,
  visibilityOptions,
  voteIntervalOptions,
} from '../../../../../../constants.ts';
import { Dispatch, useState } from 'react';
import { Value } from '../../AddPollModal.tsx';

interface ISettings {
  setClosePollOnDate: Dispatch<React.SetStateAction<boolean>>;
  closePollOnDate: boolean;
  setExpireAtDate: Dispatch<React.SetStateAction<Value>>;
  expireAtDate: Value;
  errors?: string[];
}

const Settings = ({
  setClosePollOnDate,
  closePollOnDate,
  setExpireAtDate,
  expireAtDate,
  errors,
}: ISettings) => {
  const [changeVoteOpen, setChangeVoteOpen] = useState(false);

  return (
    <fieldset className={'flex justify-between flex-wrap pr-[5px]'}>
      <SettingSection
        label={'Закрити опитування в заплановану дату'}
        checked={closePollOnDate}
        setChecked={setClosePollOnDate}
        classNameChildren={'p-[5px]'}
      >
        <DateTimePicker
          className={'my-calendar'}
          onChange={setExpireAtDate}
          value={expireAtDate}
        />
        {errors && (
          <p className={'text-start text-sm text-red-500 font-light'}>
            {errors.join(', ')}
          </p>
        )}
      </SettingSection>
      <SettingSection
        label={'Зміна вибору'}
        checked={changeVoteOpen}
        setChecked={setChangeVoteOpen}
        name={'changeVote'}
        classNameChildren={'p-[5px]'}
      >
        <DropDown
          options={voteIntervalOptions}
          onSelect={() => {}}
          name={'voteInterval'}
        />
      </SettingSection>
      <DropDown
        label={'Результати'}
        name={'resultsVisibility'}
        options={visibilityOptions}
        onSelect={() => {}}
      />
      <DropDown
        label={'Категорія'}
        options={categoryOptions}
        name={'category'}
        onSelect={() => {}}
      />
    </fieldset>
  );
};

export default Settings;
