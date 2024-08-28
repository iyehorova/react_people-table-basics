import { useEffect, useMemo, useState } from 'react';
import { Person } from '../../types';
import { getPeople } from '../../api';
import { Loader } from '../Loader';
import { PeopleTable } from '../PeopleTable';
import { PersonLink } from '../PersonLink';
import { preparedPeopleInfo } from '../../helpers/preparedPeopleInfo';

export const PeopleBlockContent = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getPeople()
      .then(setPeople)
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const fullPeopleInfo = useMemo(() => preparedPeopleInfo(people), [people]);

  if (isError) {
    return (
      <p data-cy="peopleLoadingError" className="has-text-danger">
        Something went wrong
      </p>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!!people.length) {
    return (
      <PeopleTable>
        {fullPeopleInfo.map(person => (
          <PersonLink key={person.slug} person={person} />
        ))}
      </PeopleTable>
    );
  } else {
    return <p data-cy="noPeopleMessage">There are no people on the server</p>;
  }
};
