import { Request } from 'express';
import { getUserByToken } from '../../utils/JWTAuthentication';
import { Profile, PutProfile } from '../../models/profile.model';
import { User } from '../../models/user.model';
import db from '../../database/connection';
import bCrypt from 'bcrypt';
import convertUserFromProfile from '../../utils/convertUserFromProfile';

export async function readProfile(request: Request) {
    const promise = new Promise(async (resolve, reject) => {

        await getUserByToken(request)
            .then((result: any) => {
                let profile: Profile = convertUserFromProfile(result);
                resolve(profile);
            })
            .catch(err => {
                reject(err);
                console.error(err);
            });
    });

    return promise;
}

export async function updateProfile(request: Request) {
    const promise = new Promise(async (resolve, reject) => {
        const updateUser: PutProfile = request.body
    
        let user: User = await getUserByToken(request)
                    .catch(err => reject(err)) as User;
        
        try {
            if(updateUser.user != '' && updateUser.user != undefined)
                user.nm_user = updateUser.user as string;
            if(updateUser.username != '' && updateUser.username != undefined)
                user.nm_username = updateUser.username as string;
            if(updateUser.biography != '' && updateUser.biography != undefined)
                user.ds_biography = updateUser.biography as string;
            if(updateUser.phone != '' && updateUser.phone != undefined)
                user.cd_phone_number = updateUser.phone as string;
            if(updateUser.email != '' && updateUser.email != undefined)
                user.nm_email_user = updateUser.email as string;
        } catch(e) {
            reject({message: 'Houve um erro ao atualizar suas informações. Tente novamente mais tarde. \nObs.: Indicamos renovar o token de autenticação'})
        }

        await db('tb_user')
            .where('tb_user.cd_user','=', user.cd_user)
            .update(user)
            .catch(err => {
                reject({message: 'Erro ao atualizar suas informações. Tente novamente mais tarde.'});
                console.error(err);
            });

        let response = convertUserFromProfile(user);

        resolve(response);
    });

    return promise;
}

export async function putPassword(request: Request) {
    const promise = new Promise(async (resolve, reject) => {
        // Armazeno as informações enviadas na request
        const putPassword: {
            password: string,
            newPassword: string
        } = request.body;

        // Encontro o user pelo token
        const user: User = await getUserByToken(request).catch(err => reject(err)) as User;

        // Busco no banco o hash da senha do usuario
        const userPasswordEncrypted = await db('tb_user')
                                        .select('tb_user.cd_password_hash')
                                        .where('tb_user.cd_user', '=', user.cd_user);

        // Verifico se a senha que ele enviou corresponde com a hash do banco
        await bCrypt.compare(putPassword.password, userPasswordEncrypted[0].cd_password_hash, async (err, same) => {
            // Caso não seja
            if(!same)
                reject({message: 'Senha atual incorreta!'});
            // Caso seja
            else {
                // Criptografo a nova senha do usuário
                await bCrypt.hash(putPassword.newPassword, await bCrypt.genSalt(), async (error, encrypted) => {
                    // Verifico se nao houve nenhum erro ao criptografar
                    if(error) {
                        reject({message: 'Houve um erro inesperado ao criptografar a nova senha. Tente novamente mais tarde.', error});
                        console.log(error)
                    } else {
                        // Caso não tenha erros, armazeno no banco a nova senha do usuário
                        await db('tb_user')
                            .update({cd_password_hash: encrypted})
                                .where('tb_user.cd_user', '=', user.cd_user)
                            .then(() => resolve({message: 'Senha atualizada com sucesso!'}))
                            .catch(error => {
                                reject({message: 'Houve um erro inesperado ao atualizar sua senha. tente novamente mais tarde', error})
                                console.error(error);
                            });
                    }
                });  
            }
        });
    });

    return promise;
}