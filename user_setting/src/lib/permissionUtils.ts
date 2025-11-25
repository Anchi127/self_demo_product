export type UserRole = 'Owner' | 'Admin' | 'Finance' | 'Member';

/**
 * 获取角色的中文显示名称
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    'Owner': '项目负责人',
    'Admin': '管理员',
    'Finance': '财务',
    'Member': '成员',
  };
  return roleNames[role] || role;
}

/**
 * 判断当前用户是否可以邀请成员
 */
export function canInviteMember(currentUserRole: UserRole): boolean {
  return currentUserRole === 'Owner' || currentUserRole === 'Admin';
}

/**
 * 判断当前用户是否可以编辑指定成员
 */
export function canEditMember(currentUserRole: UserRole, targetMemberRole: UserRole): boolean {
  if (currentUserRole === 'Owner') {
    return true; // Owner 可以编辑所有成员
  }
  if (currentUserRole === 'Admin') {
    return targetMemberRole !== 'Owner'; // Admin 不能编辑 Owner
  }
  return false;
}

/**
 * 判断当前用户是否可以移除指定成员
 */
export function canRemoveMember(currentUserRole: UserRole, targetMemberRole: UserRole): boolean {
  if (currentUserRole === 'Owner') {
    // Owner 可以移除管理员、财务、成员
    return targetMemberRole !== 'Owner';
  }
  if (currentUserRole === 'Admin') {
    // Admin 可以移除财务、成员（不能移除 Owner/其他Admin）
    return targetMemberRole === 'Finance' || targetMemberRole === 'Member';
  }
  return false;
}

/**
 * 判断当前用户是否可以转移 Owner
 */
export function canTransferOwner(currentUserRole: UserRole): boolean {
  return currentUserRole === 'Owner';
}

/**
 * 判断当前用户是否可以将目标成员设置为指定角色
 */
export function canSetRole(currentUserRole: UserRole, targetMemberRole: UserRole, newRole: UserRole): boolean {
  if (currentUserRole === 'Owner') {
    return true; // Owner 可以设置任何角色
  }
  if (currentUserRole === 'Admin') {
    // Admin 不能修改 Owner 角色，也不能将他人设置为 Owner
    if (targetMemberRole === 'Owner') {
      return false; // 不能修改 Owner
    }
    if (newRole === 'Owner') {
      return false; // 不能设置为 Owner
    }
    return true;
  }
  return false;
}

/**
 * 获取当前用户可以设置的角色列表
 */
export function getAvailableRoles(currentUserRole: UserRole, targetMemberRole: UserRole): UserRole[] {
  if (currentUserRole === 'Owner') {
    return ['Owner', 'Admin', 'Finance', 'Member'];
  }
  if (currentUserRole === 'Admin') {
    // Admin 不能修改 Owner，也不能设置为 Owner
    if (targetMemberRole === 'Owner') {
      return ['Owner']; // 只能保持 Owner
    }
    return ['Admin', 'Finance', 'Member'];
  }
  return [];
}

