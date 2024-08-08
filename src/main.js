import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function initRoles() {
  const rolesData = [
    'administrator',
    'user',
    'moderator',
    'editor',
    'reader',
    'sales',
    'warehouse',
    'seller'
  ]

  await prisma.role.createMany({
    data: rolesData.map((role) => ({ name: role })),
    skipDuplicates: true
  })
}

async function initPermission() {
  const permissionData = ['view_dashbboard', 'view_profile']

  await prisma.permission.createMany({
    data: permissionData.map((permission) => ({ name: permission })),
    skipDuplicates: true
  })
}

async function initAssignPermissiontoRoles() {
  const rolesPermission = {
    administrator: ['view_dashbboard', 'view_profile']
  }
  for (const [roleName, permissions] of Object.entries(rolesPermission)) {
    const role = await prisma.role.findUnique({ where: { name: roleName } })
    for (const permissionName of permissions) {
      const permission = await prisma.permission.findUnique({
        where: { name: permissionName }
      })

      if (role && permission) {
        await prisma.rolePermission.createMany({
          data: {
            roleId: role.id,
            permissionId: permission.id,
          },
          skipDuplicates: true
        })
      }
    }
  }
}


export async function initialized () {
  await initRoles()
  await initPermission()
  await initAssignPermissiontoRoles()
  console.log('Data successfully initialized in the database')
}

