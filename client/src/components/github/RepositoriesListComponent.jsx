import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ToastUtils from '../../utils/ToastUtils';
import UICardComponent from '../ui/UICardComponent';
import { Center, Spinner, Text, useColorModeValue } from '@chakra-ui/react';
import RepoCardComponent from './repo/RepoCardComponent';
import RepoLibraryViewerComponent from './repo/RepoLibraryViewerComponent';
import RepoLibraryViewerMavenComponent from './repo/RepoLibraryViewerMavenComponent';

export default function RepositoriesListComponent(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [repoList, setRepoList] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(undefined);
  const [selectedRepoJava, setSelectedRepoJava] = useState(undefined);
  const [isLibraryViewerOpen, setIsLibraryViewerOpen] = useState(false);
  const [isLibraryViewerJavaOpen, setIsLibraryViewerJavaOpen] = useState(false);

  useEffect(() => {
    onSearchApi();
  }, []);

  const onSearchApi = () => {
    setIsLoading(true);

    const token = localStorage.getItem('access_token');
    if (token === undefined) throw 'Aucun token github renseigné';

    axios
      .get('http://localhost:8080/api/v1/github/repositories?oauthToken=' + token + '&searchRepo=test')
      .then((response) => {
        const { data } = response;
        if (data.error) {
          ToastUtils.showError(data.message);
          setIsLoading(false);
        } else {
          let repos = JSON.parse(data.data);

          setRepoList(repos);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        ToastUtils.showError(error.message);
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return (
      <UICardComponent>
        <Center>
          <Spinner />
          <Text ml={2} fontSize="sm">
            Chargement de vos repos...{' '}
          </Text>
        </Center>
      </UICardComponent>
    );
  }

  return (
    <>
      <Center mb={5}>
        <Text fontSize={12} textColor={useColorModeValue('gray.400', 'gray.600')}>
          Liste de vos repos GitHub ({repoList.length})
        </Text>
      </Center>

      {repoList.map((repo) => {
        return (
          <RepoCardComponent
            key={repo.id}
            repo={repo}
            onClick={() => {
              if (repo.name === 'spring-websocket-template') {
                setSelectedRepoJava(repo);
                setIsLibraryViewerJavaOpen(true);
              } else {
                setSelectedRepo(repo);
                setIsLibraryViewerOpen(true);
              }
            }}
          />
        );
      })}

      {selectedRepo !== undefined && (
        <RepoLibraryViewerComponent
          repo={selectedRepo}
          isOpen={isLibraryViewerOpen}
          onClose={() => {
            setIsLibraryViewerOpen(false);
            setSelectedRepo(undefined);
          }}
        />
      )}

      {selectedRepoJava !== undefined && (
        <RepoLibraryViewerMavenComponent
          repo={selectedRepoJava}
          isOpen={isLibraryViewerJavaOpen}
          onClose={() => {
            setIsLibraryViewerJavaOpen(false);
            setSelectedRepoJava(undefined);
          }}
        />
      )}
    </>
  );
}
