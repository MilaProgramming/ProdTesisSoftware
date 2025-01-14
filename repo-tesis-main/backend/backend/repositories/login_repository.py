from abc import ABC, abstractclassmethod

class ILoginRepository(ABC):
    @abstractclassmethod
    def login(self):
        raise NotImplementedError
