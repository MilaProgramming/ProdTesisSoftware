from abc import ABC, abstractclassmethod

class IRegisterRepository(ABC):
    @abstractclassmethod
    def register(self):
        raise NotImplementedError
    
    @abstractclassmethod
    def getAllUsers(self):
        raise NotImplementedError 

    @abstractclassmethod
    def changeUserRole(self, userId: str, userRole: str):
        raise NotImplementedError 
